import React from 'react'

const TaskHeader = () => {
  return (
          <div className="task-header">
            <h3 className=" text-lg/8 font-semibold text-gray-900">Tasks</h3>
            <a className="btn btn-info" href="#">
              + New Task
            </a>
          </div>
  )
}

export default TaskHeader