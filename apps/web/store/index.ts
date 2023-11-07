import {atom} from "recoil";
import { selector } from "recoil";

/* creator atom*/
export const creatorState = atom({
  key: 'creators',
  default: {
    username: "",
    firstname: "",
    lastname: "",
    id: -1,
    companyname: "",
  },
});

/* video atom */
export const videoState = atom({
  key: 'video',
  default: {
    url: ""
  }
})


/* creator selectors */

export const usernameState = selector({
  key: 'usernameState',
  get: ({get}) => {
    const user = get(creatorState)
    return user.username;
  }
})


export const firstnameState = selector({
  key: 'firstnameState',
  get: ({get}) => {
    const user = get(creatorState)
    return user.firstname;
  }
})

export const lastnameState = selector({
  key: 'lastnameState',
  get: ({get}) => {
    const user = get(creatorState)
    return user.lastname;
  }
})

export const companynameState = selector({
  key: 'companynameState',
  get: ({get}) => {
    const user = get(creatorState)
    return user.companyname;
  }
})

/* */


/* editor atom*/

export const editorState = atom({
  key: 'editors',
  default: {
    username: "",
    firstname: "",
    lastname: "",
    id: -1,
  },
});


/* editor selectors */

export const usernameStateE = selector({
  key: 'EusernameState',
  get: ({get}) => {
    const user = get(editorState)
    return user.username;
  }
})

export const firstnameStateE = selector({
  key: 'EfirstnameState',
  get: ({get}) => {
    const user = get(editorState)
    return user.firstname;
  }
})

export const lastnameStateE = selector({
  key: 'ElastnameState',
  get: ({get}) => {
    const user = get(editorState)
    return user.lastname;
  }
})



