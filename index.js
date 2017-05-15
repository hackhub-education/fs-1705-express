/**
 * Created by yanhong on 2017-05-14.
 */
var express = require('express')
var app = express()
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/webdxd')

var studentSchema = {
    name: String,
    age: Number,
    school: String,
    skills: [String]
}

var Student = mongoose.model('Students', studentSchema, 'students')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/', function(req, res) {
    res.render('home', {title: 'Home Page', value: 'Hello World!'})
})

app.get('/student', function(req,res) {
    Student.find().select('name').exec(function(err, doc) {
        res.render('list', {title: 'Student List', students: doc})
    })
})

app.get('/student/add', function(req, res) {
    res.render('add', {})
})

app.get('/student/:id', function(req, res) {
    Student.findById(req.params.id, function(err, doc) {
        res.render('detail', {title: doc.name + ' Detail', student: doc})
    })
})

app.post('/student/add', function(req, res) {
    // console.log(req.body)
    var newStudent = new Student(req.body)
    newStudent.save(function(err, doc) {
        // res.render('detail', {title: doc.name + ' Detail', student: doc})
        res.redirect('/student/' + doc.id)
    })
})

app.listen(3000, function () {
    console.log('Haha Hehe!')
})