import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ 
    path: path.resolve(__dirname, '.env'),
    quiet: true
 });


const processENV = process.env.TEST_ENV
const env = processENV || 'qa'
// console.log('Test environment is: ' + env)


const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: '',
    userPassword: ''
}

if(env === 'qa') {
    config.userEmail = process.env.QA_USERNAME as string,
    config.userPassword = process.env.QA_PASSWORD as string
}
if(env === 'prod') {
    config.userEmail = process.env.PROD_USERNAME as string,
    config.userPassword = process.env.PROD_PASSWORD as string
}

export {config}

