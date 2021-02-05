import { register, checkResult, login, logout as apiLogout } from '../data.js';
import { showError, showInfo } from "../notifications.js";

export async function registerPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };
    this.partial('./templates/user/register.hbs');
}

export async function registerPost() {
    try {
        if (this.params.email.length == 0) {
            throw new Error('Email is required');
        }
        if (this.params.password.length == 0) {
            throw new Error('Password is required');
        }
        if (this.params.password !== this.params.rePassword) {
            throw new Error('Passwords don\'t match');
        }
        
        const result = await register(
            this.params.email,
            this.params.password
        );
        checkResult(result);

        // direct login after registration:
        const loginResult = await login(this.params.email, this.params.password);
        checkResult(loginResult);

        this.app.userData.email = loginResult.email;
        this.app.userData.userId = loginResult.objectId;

        showInfo('User registration successful.');
        this.redirect('#/home');

    } catch (err) {
        showError(err.message);
    }
}

export async function loginPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };
    this.partial('./templates/user/login.hbs');
}

export async function loginPost() {
    try {
        if (this.params.email.length === 0) {
            throw new Error('Email is required.');
        }
        if (this.params.password.length === 0) {
            throw new Error('Password is required.');
        }

        const result = await login(
            this.params.email,
            this.params.password
        );
        checkResult(result);

        this.app.userData.email = result.email;
        this.app.userData.userId = result.objectId;

        showInfo('Login successfull.');
        this.redirect('#/home');

    } catch (err) {
        showError(err.message);
    }
}

export async function logout() {

    try {
        await apiLogout();
        showInfo('Logout successfull.');

        this.app.userData.email = '';
        this.app.userData.userId = '';

        this.redirect('#/login');
    } catch (error) {
        showError(err.message);
    }
}