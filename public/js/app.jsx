var Student = React.createClass({
    getInitialState: function() {
        return {
            student: this.props.data,
            showUpdate: false
        }
    },

    handleClick: function() {
        var ReactThis = this
        axios.get('http://localhost:3000/api/student/' + this.props.data._id)
            .then(function(response) {
                ReactThis.setState({
                    student: response.data
                })
                }
            )
    },
    handleChange: function(e) {
        var studentObj = this.state.student
        studentObj[e.target.name] = e.target.value
        this.setState({
            student: studentObj
        })
    },
    handleSubmit: function(e) {
        e.preventDefault()
        var ReactThis = this
        axios.post('http://localhost:3000/api/student/' + this.state.student._id, this.state.student)
            .then(function() {
                ReactThis.setState({
                    showUpdate: false
                })
            })
    },
    showUpdate: function() {
        var ReactThis = this
        axios.get('http://localhost:3000/api/student/' + this.props.data._id)
            .then(function(response) {
                    ReactThis.setState({
                        student: response.data,
                        showUpdate: true
                    })
                }
            )
    },
    handleDelete: function() {
        var ReactThis = this
        axios.delete('http://localhost:3000/api/student/' + this.props.data._id)
            .then(function(response) {
                    ReactThis.props.remove(ReactThis.props.data)
                }
            )
    },
    render: function() {

        var updateForm = (
            <div>
                <button onClick={this.showUpdate}>update</button>
                <button onClick={this.handleDelete}>delete</button>
            </div>
        )

        if (this.state.showUpdate) {
            updateForm = (

                <form onSubmit={this.handleSubmit}>

                    <input type="text" name="name" placeholder="Name" value={this.state.student.name} onChange={this.handleChange}/>

                    <input type="text" name="age" placeholder="Age" value={this.state.student.age} onChange={this.handleChange}/>

                    <input type="text" name="school" placeholder="School" value={this.state.student.school} onChange={this.handleChange}/>

                    <button>Submit</button>

                </form>

            )
        }

        return (

            <div>
                <h1 onClick={this.handleClick}>{this.state.student.name}</h1>
                {updateForm}
            </div>


        )
    }
})

var StudentList = React.createClass({
    getInitialState: function() {
      return {
          studentList: [],
          newStudent: {}
      }
    },
    componentWillMount: function() {
        var ReactThis = this
        axios.get('http://localhost:3000/api/student')
            .then(function(response) {
                ReactThis.setState({
                    studentList: response.data
                    })
            })
    },

    handleSubmit: function(e) {
        e.preventDefault()
        var ReactThis = this
        axios.post('http://localhost:3000/api/student', this.state.newStudent)
            .then(function(response) {
                var newStudentList = ReactThis.state.studentList
                newStudentList.push(response.data)
                ReactThis.setState({
                    studentList: newStudentList,
                    newStudent: {}
                })
            })
        this.setState({
            newStudent: {}
        })
    },
    handleChange: function(e) {
        this.state.newStudent[e.target.name] = e.target.value
    },
    removeStudent: function(student) {
        // remove student from student list
        var studentList = this.state.studentList
        var deleteIndex = studentList.indexOf(student)
        if (deleteIndex > -1) {
            studentList.splice(deleteIndex, 1);
        }
        this.setState({
            studentList: studentList
        })

    },
    render: function() {
        console.log(this.state.newStudent)
        var ReactThis = this
        return (<div>
                {this.state.studentList.map(
                    function(student) {
                        return <Student data={student} remove={ReactThis.removeStudent} key={student._id}/>
                    }
                )}

                <form onSubmit={this.handleSubmit}>

                    <input type="text" name="name" placeholder="Name" value={this.state.newStudent.name} onChange={this.handleChange}/>

                    <input type="text" name="age" placeholder="Age" value={this.state.newStudent.age} onChange={this.handleChange}/>

                    <input type="text" name="school" placeholder="School" value={this.state.newStudent.school} onChange={this.handleChange}/>

                    <button>Submit</button>

                </form>

            </div>
        )
    }
})

ReactDOM.render(

   <StudentList/> , document.getElementById('app')

)