import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';


[
    //2 chars - min. error boundary
    { username: 'dd', usernameErrorMessage: 'is too short (minimum is 3 characters)' },
    //3 chars - min boundary
    { username: 'ddd', usernameErrorMessage: '' },
    //20 chars - max boundary
    { username: 'dddddddddddddddddddd', usernameErrorMessage: '' },
    //21 chars - max. error boundary
    { username: 'ddddddddddddddddddddx', usernameErrorMessage: 'is too long (maximum is 20 characters)' },
].forEach(({ username, usernameErrorMessage }) => {
    test(`Error message validation for ${username}`, async ({ api }) => {

        const newUserResponse = await api
            .path('/users')
            .body({
                "user": {
                    "email": "e",
                    "password": "d",
                    "username": username
                }
            })
            .clearAuth()
            .postRequest(422)

        if(username.length == 3 || username.length == 20) {
            expect(newUserResponse.errors).not.toHaveProperty('username')
        } else {
            expect(newUserResponse.errors.username[0]).shouldEqual(usernameErrorMessage)
        }
    })
})

