import initialState from '../state';

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toggleBottomModal': {
      const bottomModal = action.payload.bottomModal;
      return {
        ...state,
        bottomModal,
      };
    }
    case 'viewTask': {
      const selectedTask = action.payload.selectedTask;
      return {
        ...state,
        selectedTask,
      };
    }
    case 'selectData': {
      const selectedProject = action.payload.selectedProject;
      return {
        ...state,
        selectedProject,
      };
    }
    case 'designation': {
      const isPM = action.payload.isPM;
      return {
        ...state,
        isPM,
      };
    }
    case 'projectData': {
      const projectsData = action.payload.projectsData;
      return {
        ...state,
        projectsData,
      };
    }
    case 'taskData': {
      const tasksData = action.payload.tasksData;
      return {
        ...state,
        tasksData,
      };
    }
    case 'islogin': {
      const token = action.payload.taskAll;
      return {
        ...state,
        token,
      };
    }
    case 'loginScreen': {
      const UserData = action.payload.UserData;
      return {
        ...state,
        UserData,
      };
    }
    default:
      return state;
  }
};
