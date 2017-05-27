var Student = React.createClass({
    getInitialState: function() {
        return {
            student: this.props.data
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
    render: function() {
        return (

            <div>
                <h1 onClick={this.handleClick}>{this.state.student.name} {this.state.student.age}</h1>
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
        axios.post('http://localhost:3000/api/student', this.state.newStudent)
            .then(function(response) {
                console.log(response)
            })
        console.log(this.state.newStudent)
    },
    handleChange: function(e) {
        var studentObj = this.state.newStudent
        studentObj[e.target.name] = e.target.value
        this.setState({
            newStudent: studentObj
        })
    },
    render: function() {
        return (<div>
                {this.state.studentList.map(
                    function(student) {
                        return <Student data={student} key={student._id}/>
                    }
                )}

                <form onSubmit={this.handleSubmit}>

                    <input type="text" name="name" placeholder="Name" onChange={this.handleChange}/>

                    <input type="text" name="age" placeholder="Age" onChange={this.handleChange}/>

                    <input type="text" name="school" placeholder="School" onChange={this.handleChange}/>

                    <button>Submit</button>

                </form>

            </div>
        )
    }
})

ReactDOM.render(

   <StudentList/> , document.getElementById('app')

)