/**
 * Created by yanhong on 2017-05-14.
 */
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cors = require('cors')
var userArray = []

mongoose.connect('mongodb://localhost/webdxd')

var studentSchema = {
    name: String,
    age: Number,
    school: String,
    skills: [String],
    isOnline: Boolean
}

var Student = mongoose.model('Students', studentSchema, 'students')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors());

app.get('/', function(req, res) {
    res.render('home', {title: 'Home Page', value: 'Hello World!'})
})

app.get('/student', function(req,res) {
    Student.find().select('name').exec(function(err, doc) {
        res.render('list', {title: 'Student List', students: doc})
    })
})

app.get('/api/student', function(req,res) {
    Student.find().select('name').exec(function(err, doc) {
        res.send(doc)
    })
})

app.post('/api/student', function(req,res) {
    // console.log(req.body)
    var newStudent = new Student(req.body)
    newStudent.save(function(err, doc) {
        res.send({_id: doc._id, name: doc.name})
    })
})

app.get('/api/student/:id', function(req, res) {
    Student.findById(req.params.id, function(err, doc) {
        res.send(doc)
    })
})

app.post('/api/student/:id', function(req, res) {
    Student.update(req.body._id, req.body, function(err, doc) {
        res.send(doc)
    });
})

app.delete('/api/student/:id', function(req, res) {
    Student.remove({_id: req.params.id}, function(err, doc) {
        res.send(doc)
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

app.post('/chat', function(req, res) {

    Student.findOne({name: req.body.username}).exec(function(err, doc) {
        if (doc) {
            res.render('chat', {user: doc})
        } else {
            var newStudent = new Student({name: req.body.username, isOnline: true})
            newStudent.save(function(err, doc) {
                res.render('chat', {user: doc})
            })
        }
    })

})

app.get('/auth', function(req, res) {
    res.render('login', {})
})

io.on('connection', function(socket) {

    var emitEvent = function(msg) {
        io.emit('system message', {
            message: msg,
            users: userArray
        })
    }

    socket.on('send id', function (currentId) {

        var currentUser = {}

        Student.findOneAndUpdate({_id: currentId}, {$set: {isOnline: true}},  function(err, doc) {
            currentUser = doc;
            Student.find().exec(function(err, doc) {
                userArray = doc
                emitEvent(currentUser.name + ' connected.');
            })
        })

        socket.on('send msg', function(obj) {
            io.emit('show msg', obj)
        })

        socket.on('disconnect', function () {
            Student.findById(currentId, function (err, doc) {
                doc.isOnline = false
                doc.save(function(err, doc) {
                    Student.find().exec(function(err, doc) {
                        userArray = doc
                        emitEvent(currentUser.name + ' disconnected.')
                    })
                })

            })
        })
    })
})

http.listen(3000, function () {
    console.log('Haha Hehe!')
})