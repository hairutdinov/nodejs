exports.getLogin = (req, res, next) => {
    const loggedInCookie = req.get('Cookie').split(';').find(cookie => cookie.indexOf('loggedIn') !== -1);
    let loggedIn = false
    if (loggedInCookie) {
        loggedIn = (loggedInCookie.trim().split('=')[1] ?? false) === 'true'
    }
    res.render('auth/login', {
        path: '/auth/login',
        title: 'Login',
        isAuthenticated: loggedIn
    })
}

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
    res.redirect('/')
}
