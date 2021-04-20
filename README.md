# Improved-EOPSI

This implementation is an improved version of the [original EOPSI paper](https://ieeexplore.ieee.org/document/9260663)

## Our improvements

### Improving the security assumptions in the original EOPSI paper
The biggest security assumption in the original EOPSI paper lies in master keys being sent between clients in order to compute their private set intersection. Through changing key steps in the original EOPSI paper, clients now do not have to send master keys between each other in order to compute their PSI. 

## The application
This application consists of 2 main components:
- client-app
- cloud-app

### Running the application
At the server directories of the client app and cloud app, run `npm run dev` in the cli



