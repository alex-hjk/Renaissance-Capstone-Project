"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../../../common/utils/auth");
const typedi_1 = require("typedi");
const dbAccess_1 = require("../../../../common/dataAccess/dbAccess");
const google_auth_library_1 = require("google-auth-library");
const googleAuth_1 = require("../../../../config/googleAuth");
let AuthService = class AuthService {
    async VerifyGoogleToken({ googleAuthToken }) {
        const client = new google_auth_library_1.OAuth2Client(googleAuth_1.GOOGLE_AUTH_CLIENT_ID);
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: googleAuthToken,
                audience: googleAuth_1.GOOGLE_AUTH_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userid = payload && payload.sub;
            const name = payload && payload.name;
            const email = payload && payload.email;
            const profilePicUrl = payload && payload.picture;
            if (userid && name && email) {
                return { googleId: userid, email, name, profilePicUrl };
            }
            else {
                throw new Error('Error verifying google token');
            }
        }
        return verify();
    }
    async SignUp({ name, email, password, googleId, profilePicUrl }) {
        const queryString = 'SELECT * FROM rozzby.users where email = $1';
        const params = [email];
        let hashedPassword = null;
        let salt = null;
        try {
            const res = await dbAccess_1.query(queryString, params);
            if (!res.rows.length) {
                if (password) {
                    const result = auth_1.hashPassword(password);
                    hashedPassword = result.hashedPassword;
                    salt = result.salt;
                }
                const uuid = auth_1.generateUUID();
                const queryString = `INSERT INTO rozzby.users (uid,email, ${hashedPassword ? 'hashed_password' : 'google_id'}, password_salt, name ${profilePicUrl ? ',profile_pic_url' : ''}) VALUES ($1, $2, $3, $4, $5 ${profilePicUrl ? ',$6' : ''})`;
                const params = [uuid, email, `${hashedPassword || googleId}`, `${salt || ''}`, name];
                if (profilePicUrl) {
                    params.push(profilePicUrl);
                }
                await dbAccess_1.query(queryString, params);
                const queryString1 = 'Insert into rozzby.sid_users (sid, uid) values ($1,$2);';
                const params1 = [1, uuid];
                await dbAccess_1.query(queryString1, params1);
                const queryString2 = 'select A.sid, name, threshold from rozzby.sid_users A, rozzby.subjects B where A.sid = B.id and uid = $1';
                const params2 = [uuid];
                const res = await dbAccess_1.query(queryString2, params2);
                const subjectsRegistered = res.rows;
                const user = {
                    uid: uuid,
                    email,
                    profilePicUrl
                };
                const token = auth_1.generateAccessToken(user);
                return { user, token, subjectsRegistered };
            }
            else {
                return { user: null, token: null, error: { type: 'userExists', message: 'User with this email exists' } };
            }
        }
        catch (e) {
            return { user: null, token: null, error: { type: 'general', message: e.message } };
        }
    }
    async SignIn({ email, password, googleId }) {
        const queryString = 'SELECT uid, hashed_password, password_salt, profile_pic_url from rozzby.users where email = $1 or google_id = $2';
        const params = [email, (googleId || '')];
        const res = await dbAccess_1.query(queryString, params);
        if (res.rows.length) {
            const { hashed_password: hashedPassword, password_salt: passwordSalt, uid, profile_pic_url } = res.rows[0];
            const verified = !!((password && auth_1.verifyPassword(password, hashedPassword, passwordSalt)) || googleId);
            if (verified) {
                const user = {
                    uid,
                    email,
                    profilePicUrl: profile_pic_url
                };
                const token = auth_1.generateAccessToken(user);
                const queryString1 = 'select A.sid, name, threshold from rozzby.sid_users A, rozzby.subjects B where A.sid = B.id and uid = $1';
                const params1 = [uid];
                const res1 = await dbAccess_1.query(queryString1, params1);
                const subjectsRegistered = res1.rows;
                return { user, token, subjectsRegistered };
            }
            else {
                return { user: null, token: null, error: { type: 'passwordIncorrect', message: 'Password Incorrect' } };
            }
        }
        else {
            return { user: null, token: null, error: { type: 'userNotExists', message: 'User With this email does not exist' } };
        }
    }
    async RefreshToken({ token }) {
        const user = {
            uid: '',
            email: 'testEmail'
        };
        const newToken = 'testRefreshToken';
        return { user, token: newToken, refreshToken: newToken };
    }
};
AuthService = __decorate([
    typedi_1.Service()
], AuthService);
exports.default = AuthService;
