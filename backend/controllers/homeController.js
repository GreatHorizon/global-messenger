
exports.GetHome = (req, res) => {
    console.log('================home')
    console.log(req.session)
    console.log(req.cookies)
    console.log(req.session.user)   
    console.log('================home')
    if (req.session.user) {       
        res.status(200).send('success')
    } else {
        res.status(400).send('fail')
    }
}