var createStore = Redux.createStore;
var combineReducers = Redux.combineReducers;
const ADD_TODO = 'ADD_TODO';
const COMPLETE_TODO = 'COMPLETE_TODO';
const SETFILTER = 'SETFILTER';
const FILTER = {
    SHOW_ALL:'SHOW_ALL',
    SHOW_COMPLETE:'SHOW_COMPLETE',
    SHOW_ACTIVE:'SHOW_ACTIVE'
};

function addTodo(text){
    return {
        type:ADD_TODO,
        text
    }
}
function completeTodo(index){
    return {
        type:COMPLETE_TODO,
        index
    }
}
function selectFilter(filter){
    return {
        type:SETFILTER,
        filter
    }
}
var initState = {
    filter:'SHOW_ALL',
    todos:[]
}
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [...state, {
                text:action.text,
                completed: false
            }];
        case COMPLETE_TODO:
            return [
                ...state.slice(0, parseInt(action.index)),
                Object.assign({}, state[action.index], {
                    completed: true
                }),
                ...state.slice(parseInt(action.index)+ 1)
            ];
        default:
            return state;
    }
}
function setFilter(state = FILTER.SHOW_ALL,action){
    switch(action.type){
        case SETFILTER:
            return action.filter;
        default:
            return state;
    }
}
var todoApp = combineReducers({
    filter:setFilter,
    todos:todos
});
var store = createStore(todoApp);
var AddTodoCom = React.createClass({
    getInitialState:function(){
        return {
            items:store.getState()
        }
    },
    componentDidMount:function(){
        var unsubscribe = store.subscribe(this.onChange);
    },
    onChange:function(){
        this.setState({
            items:store.getState()
        });
    },
    handleSelect:function(e){
        store.dispatch(selectFilter( e.target.dataset.select));
        e.target.classList.add('select');
    },
    handleClick:function(e){
        var addInput = ReactDOM.findDOMNode(this.refs.todo);
        var addText = addInput.value.trim();
        if(addText){
            store.dispatch(addTodo(addText));
            addInput.value = '';
        }
        else{
            alert('请输入内容');
        }
    },

    handleComplete:function(e){
        store.dispatch(completeTodo(e.target.dataset.index));
        e.target.classList.add('complete');
    },
    render:function(){
        return(
            <div className='warp'>
                <h1 className="title">todos</h1>
                <div>
                    <input type='text' className="input-lg" ref='todo'/>
                    <button onClick={this.handleClick} className="button-lg">add todo ☠</button>
                    <div className="list">

                            {
                                this.state.items.todos.filter(function(item){
                                    switch(this.state.items.filter){
                                        case 'SHOW_ALL':
                                            return true;
                                        case 'SHOW_COMPLETE':
                                            return item.completed;
                                        case 'SHOW_ACTIVE':
                                            return !item.completed;

                                        case 'delete_completed':
                                            return item.completed = null;
                                    }
                                }.bind(this)).map(function(item){
                                    var index = this.state.items.todos.indexOf(item);
                                    return item.completed ? <li className='complete' data-index={index}>{item.text}</li> : <li data-index={index} onClick={this.handleComplete}>{item.text}</li>
                                }.bind(this))
                            }

                    </div>
                    <div className="but">
                        <button className="btn" onClick={this.handleSelect} data-select='SHOW_ALL'>ALL</button>
                        <button className="btn" onClick={this.handleSelect} data-select='SHOW_COMPLETE'>COMPLETE</button>
                        <button className="btn" onClick={this.handleSelect} data-select='SHOW_ACTIVE'>ACTIVE</button>
                        <button className="btn" onClick={this.handleSelect} data-select='delete_completed'>clear completed</button>
                    </div>

                </div>

            </div>
        );
    }
});




ReactDOM.render(
    <AddTodoCom />,
    document.getElementById('mvc')
);
