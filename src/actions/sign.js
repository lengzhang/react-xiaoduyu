import graphql from '../common/graphql';

let Fetch = async (api = '', data = {}) => {
    return await fetch(`${window.location.origin}${api}`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({access_token: data.access_token})
    })
    .then((res) => (res.json()));
}

// cookie安全措施，在服务端使用 http only 方式储存cookie
export const saveSignInCookie = ({ access_token }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {
        let res = await Fetch('/sign/in', {access_token});
        resolve(res);
    })
  }
}

// 登录
export const signIn = ({ data }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        api: 'signIn',
        args: data,
        fields: `
          user_id
          access_token
        `
      });
      if (err) return resolve([ err ? err.message : '账号或密码错误' ]);

      res = await saveSignInCookie(res)(dispatch, getState);

      if (res.success) {
        window.location.reload();
      }
    })
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
        let res = await Fetch('/sign/out');
        if (res.success) {
            window.location.reload();
        }
        resolve([res])
    })
  }
}

export const signUp = (args) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addUser',
        args,
        fields: `
          success
        `
      });

      if (err) {
        resolve([err])
      } else {
        resolve([null, res])
      }

    })
  }
}
