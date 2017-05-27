var Student = React.createClass({
    render: function() {
        return (
            <h1>{this.props.name}</h1>
        )
    }
})

var StudentList = React.createClass({
    getInitialState: function() {
      return {
          studentList: []
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
    render: function() {
        return (<div>
                {this.state.studentList.map(
                    function(student) {
                        return <Student name={student.name} key={student._id}/>
                    }
                )}
            </div>
        )
    }
})

ReactDOM.render(

   <StudentList/> , document.getElementById('app')

)