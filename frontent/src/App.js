import React from 'react';
import './App.css';

class App extends React.Component {
  
  
  constructor(props){
    super(props);
    this.state={
      todoList:[],
      activeItem:{
        id:null,
        title:'',
        completed:false,
      },
      editing:false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.edit = this.edit.bind(this)
    this.complete = this.complete.bind(this)

    this.deleteItem = this.deleteItem.bind(this)
  };
  

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentWillMount(){
    this.fetchTasks()
  }

  fetchTasks(){
    console.log('fetching...')

    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(Response => Response.json())
    .then(data => 
      this.setState({
        todoList:data
      })
      )
  }

  handleChange(e){
    var name= e.target.name
    var value = e.target.value
    console.log('Name: ',name);
    console.log('value: ',value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })

  }

  
  handleSubmit(e){
    e.preventDefault()
    console.log('Item : ',this.state.activeItem)
    var csrf_token = this.getCookie('csrftoken')
    var url = 'http://127.0.0.1:8000/api/task-create/'

    if (this.state.editing === true){
    url =`http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`

      this.setState({
        editing:false
      })

    }
    fetch(url, {
      method:'POST',
      headers:{
        "content-type":'application/json',
        'X-CSRFToken':csrf_token,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then(()=>{
      this.fetchTasks()
      this.setState({
        activeItem:{
          id:null,
          title:'',
          completed:false,
        }

      })
    }).catch(function(error){
      console.log('Error:',error)
    })
  }



  edit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }


  deleteItem(task){
    var csrf_token = this.getCookie('csrftoken')
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method:'DELETE',
      headers:{
        'content-type':'application/json',
        'X-CSRFToken':csrf_token,
      }
    }).then(()=>{
      this.fetchTasks()
    })
  }


  complete(task){

    task.completed = ! task.completed
    var csrf_token = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`

    fetch(url, {
      method:'POST',
      headers:{
        'content-type':'application/json',
        'X-CSRFToken':csrf_token,
      },
      body:JSON.stringify({'completed':task.completed, 'title':task.title})
    }).then(()=> {
      this.fetchTasks()
    })

  }
  
  render(){

        var tasks = this.state.todoList
        var self = this


        return(
            <section className="vh-100">
  <div className="container py-5 h-100 align-items-center">
    <span>© created by: <a style={{'color':'black','textDecoration':'none'}} href='https://muhammediyasresume.herokuapp.com/' className='fg-light'> Muhammed Iyas</a></span>
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col align-items-center d-flex justify-content-center">
        <div className="card  " id="list1" >
          <div className="card-body py-4 px-4 px-md-5">

            <p className="h1 text-center mt-3 mb-4 pb-3 text-primary">
              <i className="fas fa-check-square me-1"></i>
               Todo
            </p>

            <div className="pb-2">
              <div className=" ">
                <div className="card-body">
                  <form onSubmit={this.handleSubmit}>
                  <div className="d-flex flex-row align-items-center">
                    <input onChange={this.handleChange} type="text" value={this.state.activeItem.title} className="form-control form-control-lg" id="exampleFormControlInput1"
                      placeholder="Add new..."/>
                    <a href="#!" data-mdb-toggle="tooltip" title="Set due date"><i
                        className="fas fa-calendar-alt fa-lg me-3"></i></a>
                    <div>
                      <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                  </div>
                  </form>
                </div>
              </div>
            </div>

            <hr className="my-4"/>

            <div>
              {tasks.map(function(task,index){
                return(
                
            <ul key={index} className="list-group list-group-horizontal rounded-0 bg-transparent">
              <li
                className="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                  <div onClick={() => self.complete(task)} className="form-check">
                  {task.completed === false ? (
                    
                    <input className="form-check-input me-0" type="checkbox"  id="flexCheckChecked1"
                      aria-label="..."  />
                  
                  ) : (
                    <input className="form-check-input me-0" defaultChecked type="checkbox"  id="flexCheckChecked1"
                      aria-label="..."  />
                
                  )}
                </div>
              </li>
              <li
                className="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                    
                    <p className="lead fw-normal mb-0">{task.title}</p>
                
               
              </li>
              <li className="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                <div className="d-flex flex-row justify-content-end mb-1">
                <button onClick={() => self.edit(task)} className="text-info" data-mdb-toggle="tooltip" style={{'backgroundColor':'transparent','border':'none'}} title="Edit todo"><svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
</svg></button>
                  <button onClick={() => self.deleteItem(task)} className="text-danger" data-mdb-toggle="tooltip" style={{'backgroundColor':'transparent','border':'none'}} title="Delete todo"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor" className="bi bi-archive-fill" viewBox="0 0 16 16">
  <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
</svg></button>
                </div>
             
              </li>
            </ul>
              
              )
            })}

            </div>
        
         

          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    )}
}


export default App;
