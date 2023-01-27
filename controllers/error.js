exports.notFound = (req, res, next) => {
    res.status(404).render('404-not-found', { title: '404 Page Not Found' })
}

exports.internalServerError = (req, res, next) => {
    res.status(500).render('500-internal-server-error', { title: '500 Internal Server Error' })
}
