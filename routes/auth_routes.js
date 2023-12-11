import { Router } from "express";
import { checkNull, checkString, trimString } from "../helper.js";
import { authDataFuncs } from "../data/index.js";
const router = Router();

router
    .route('/register')
    .get(async (req, res) => {
        //code here for GET
        //Below code will render the register page
        res.render('register', { title: 'register', hasError: false });
    })
    .post(async (req, res) => {
        //code here for POST
        let postData = req.body;
        postData = JSON.stringify(postData);
        postData = JSON.parse(postData);
        try {
            checkNull(postData.emailAddressInput, 'emailAddress');
            checkNull(postData.passwordInput, 'password');
            checkNull(postData.confirmPasswordInput, 'Confirm password');
            checkNull(postData.ageInput, 'Age');
            checkNull(postData.roleInput, 'Role');
            if (postData.roleInput === 'user') {
                let preferGenres = ["action", "adventure", "comedy", "drama", "fantasy", "horror", "musicals", "mystery", "romance", "science fiction", "sports", "thriller", "western"];
                checkNull(postData.preferGenreInput, 'Prefer Genre')
                if (typeof postData.preferGenreInput !== 'string' && !Array.isArray(postData.preferGenreInput)) {
                    throw `Prefer Genre can be a string value or an array.`;
                }
                if (typeof postData.preferGenreInput === 'string') {
                    checkNull(postData.preferGenreInput, 'Prefer Genre');
                    checkString(postData.preferGenreInput);
                    postData.preferGenreInput = trimString(postData.preferGenreInput);
                    postData.preferGenreInput = postData.preferGenreInput.toLowerCase();
                    if (!preferGenres.includes(postData.preferGenreInput)) {
                        throw `Prefer Genre can have action, adventure, comedy, drama, fantasy, horror, musicals, mystery, romance, science fiction, sports, thriller, and western as the value`;
                    }
                    let temp = postData.preferGenreInput;
                    postData.preferGenreInput = [];
                    postData.preferGenreInput.push(temp);
                }
                else {
                    if (!Array.isArray(postData.preferGenreInput)) {
                        throw `Prefer genre must be an array.`;
                    }
                    for (let x of postData.preferGenreInput) {
                        checkNull(x, 'genre values');
                        checkString(x, 'genre values');
                        x = trimString(x);
                        x = x.toLowerCase();
                        if (!preferGenres.includes(x)) {
                            throw `Prefer Genre can have action, adventure, comedy, drama, fantasy, horror, musicals, mystery, romance, science fiction, sports, thriller, and western as the value`;
                        }
                    }
                }
            }
            checkString(postData.emailAddressInput, 'emailAddress');
            postData.emailAddressInput = trimString(postData.emailAddressInput);
            checkString(postData.passwordInput, 'password');
            postData.passwordInput = trimString(postData.passwordInput);
            checkString(postData.confirmPasswordInput, 'confirm password');
            postData.confirmPasswordInput = trimString(postData.confirmPasswordInput);
            checkString(postData.roleInput, 'role');
            postData.role = trimString(postData.role);
            let match;
            postData.emailAddressInput = postData.emailAddressInput.toLowerCase();
            if (postData.emailAddressInput.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
                match = postData.emailAddressInput.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
            if (match === null || match !== postData.emailAddressInput) {
                throw 'email address must be in a valid email format.';
            }
            if (postData.passwordInput.length < 8) {
                throw `Password must be at least 8 characters long.`;
            }
            if (postData.passwordInput.match(/[A-Z]/g) === null) {
                throw `Password must contain at least one uppercase character.`;
            }
            if (postData.passwordInput.match(/[0-9]/g) === null) {
                throw `Password must contain at least one number.`;
            }
            if (postData.passwordInput.match(/[^A-Za-z0-9]/g) === null) {
                throw `Password must contain at least one special character.`;
            }
            if (postData.passwordInput.match(/\s/g) !== null) {
                throw `Password cannot contain space.`;
            }
            if (postData.passwordInput !== postData.confirmPasswordInput) {
                throw `Confirm Password and password fields values must match.`;
            }
            postData.roleInput = postData.roleInput.toLowerCase();
            if (postData.roleInput !== 'admin' && postData.roleInput !== 'user') {
                throw `Role can either have admin or user as its value.`;
            }
            if (typeof postData.ageInput === 'string') {
                postData.ageInput = trimString(postData.ageInput);
                if (postData.ageInput.length <= 0) {
                    throw `Age must have a valid value and cannot contain only spaces.`;
                }
                if (postData.ageInput.match(/[0-9][0-9]*/) === null) {
                    throw 'Age must be a positive whole number greater than or equal to 18 and less than or equal to 100.';
                }
                postData.ageInput = parseInt(postData.ageInput);
                if (postData.ageInput < 18 || postData.ageInput > 100) {
                    throw `Age must be between 18 and 100.`;
                }
            }
            else {
                postData.ageInput = postData.ageInput.toString();
                postData.ageInput = trimString(postData.ageInput);
                if (postData.ageInput.length <= 0) {
                    throw `Age must have a valid value and cannot contain only spaces.`;
                }
                if (postData.ageInput.match(/[0-9][0-9]*/) === null) {
                    throw 'Age must be a positive whole number greater than or equal to 18 and less than or equal to 100.';
                }
                postData.ageInput = parseInt(postData.ageInput);
                if (postData.ageInput < 18 || postData.ageInput > 100) {
                    throw `Age must be between 18 and 100.`;
                }
            }
        } catch (e) {
            return res.status(400).render("register", { authUser: req.session.user, title: 'register', hasError: true, error: e, postData });
        }
        try {
            const success = await authDataFuncs.registerUser(postData.emailAddressInput, postData.passwordInput, postData.ageInput, postData.roleInput, postData.preferGenreInput);
            if (!success) {
                return res.status(500).render("register", { authUser: req.session.user, title: 'register', hasError: true, error: "Internal Server Error", postData });
            }
            res.redirect("/login");
        } catch (e) {
            return res.status(400).render("register", { authUser: req.session.user, title: 'register', hasError: true, error: e, postData });
        }
    });

router
    .route('/login')
    .get(async (req, res) => {
        //code here for GET
        res.render('login', {  title: 'login', hasError: false, postData: "" });
    })
    .post(async (req, res) => {
        //code here for POST
        const postData = req.body;
        try {
            checkNull(postData.emailAddressInput, 'emailAddress');
            checkNull(postData.passwordInput, 'password');
            checkString(postData.emailAddressInput, 'emailAddress');
            checkString(postData.passwordInput, 'password');
            postData.emailAddressInput = trimString(postData.emailAddressInput);
            postData.passwordInput = trimString(postData.passwordInput);
            let match;
            postData.emailAddressInput = postData.emailAddressInput.toLowerCase();
            if (postData.emailAddressInput.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
                match = postData.emailAddressInput.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
            if (match === null || match !== postData.emailAddressInput) {
                throw 'email address must be in a valid email format.';
            }
            if (postData.passwordInput.length < 8) {
                throw `Password must be at least 8 characters long.`;
            }
            if (postData.passwordInput.match(/[A-Z]/g) === null) {
                throw `Password must contain at least one uppercase character.`;
            }
            if (postData.passwordInput.match(/[0-9]/g) === null) {
                throw `Password must contain at least one number.`;
            }
            if (postData.passwordInput.match(/[^A-Za-z0-9]/g) === null) {
                throw `Password must contain at least one special character.`;
            }
            if (postData.passwordInput.match(/\s/g) !== null) {
                throw `Password cannot contain space.`;
            }
        } catch (e) {
            return res.status(400).render("login", {title: 'login', hasError: true, error: e, postData });
        }
        try {
            const user = await authDataFuncs.loginUser(postData.emailAddressInput, postData.passwordInput);
            if (user) {
                req.session.user = user;
                if (user.isAdmin) {
                    res.redirect("/admin");
                }
                else
                    res.redirect("/users");
            }
        } catch (e) {
            return res.status(400).render("login", { authUser: req.session.user, title: 'login', hasError: true, error: e, postData });
        }
    });

router.route('/error').get(async (req, res) => {
    //code here for GET
    return res.status(403).render("error", { authUser: req.session.user, title: 'error' });
});

router.route('/logout').get(async (req, res) => {
    //code here for GET
    req.session.destroy(() => {
        console.log('session destroyed.');
    });
    res.redirect("/");
});
export default router;
