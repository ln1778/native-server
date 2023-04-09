import { useState, useEffect, useReducer } from 'react';
import axios, * as defaultAxios from 'axios';
import { getStorage, deloneStorage } from './commont';
import { initialResponse, responseReducer, actions } from './reducers';
import myconfig from "./config";

/**
 * Params
 * @param  {AxiosInstance} axios - (optional) The custom axios instance
 * @param  {string} url - The request URL
 * @param  {('GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'OPTIONS'|'PATCH')} method - The request method
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param  {object|string} trigger - (optional) The conditions for AUTO RUN, refer the concepts of [conditions](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) of useEffect, but ONLY support string and plain object. If the value is a constant, it'll trigger ONLY once at the begining
 * @param  {function} [forceDispatchEffect=() => true] - (optional) Trigger filter function, only AUTO RUN when get `true`, leave it unset unless you don't want AUTU RUN by all updates of trigger
 * @param  {function} [customHandler=(error, response) => {}] - (optional) Custom handler callback, NOTE: `error` and `response` will be set to `null` before request
 */

/**
 * Returns
 * @param  {object} response - The response of Axios.js (https://goo.gl/dJ6QcV)
 * @param  {object} error - HTTP error
 * @param  {boolean} loading - The loading status
 * @param  {function} reFetch - MANUAL RUN trigger function for making a request manually
 */

const { CancelToken, isCancel } = defaultAxios;
const _Object = Object;

export default ({
  url,
  method = 'post',
  data = {},
  trigger,
  filter,
  forceDispatchEffect,
  customHandler,
} = {}) => {
  const [results, dispatch] = useReducer(responseReducer, initialResponse);
  const [innerTrigger, setInnerTrigger] = useState(0);

  let outerTrigger = trigger;
  try {
    outerTrigger = JSON.stringify(trigger);
  } catch (err) {
    //
  }
  const params = new FormData();
  const dispatchEffect = forceDispatchEffect || filter || (() => true);

  const handler = (error, response, data) => {
    if (customHandler) {
      customHandler(error, data, response);
    }
  };
  let axioshooks = axios.create();

  const source = CancelToken.source();
  let config = {
    headers: {'Access-Control-Allow-Origin': '*',"Content-Type":"multipart/form-data"},
    cancelToken: source.token,
  };

  if (method && method == 'get') {
    axioshooks = axios.get;
  } else if (method && method == 'file') {
    config.headers["Content-Type"] ='multipart/form-data';
    config.headers["Accept"] ='*/*';
    axioshooks = axios.post;
  } else {
    config.headers['Content-Type']='multipart/form-data';
    axioshooks = axios.post;
  }
 
  useEffect(() => {
    if (!url || !dispatchEffect()) return;
    // ONLY trigger by query
    if (outerTrigger && !innerTrigger) {
      return;
    }

    handler(null, null);
    dispatch({ type: actions.init });

    let paramsdata = null;
    if (data) {
      if (method && method == 'file') {
        _Object.values(data).map((d, index) => {
          if ((d && d != '') || typeof d == 'number') {
            if (Object.keys(data)[index] == 'file') {
              params.append('file', d, d.name);
            } else {
              params.append(Object.keys(data)[index], d);
            }
          }
        });
        paramsdata = params;
      } else if (method && method == 'get') {
        const getmethoddata = {};
        _Object.values(data).map((h, index) => {
          if ((h && h != '') || typeof h == 'number') {
            getmethoddata[Object.keys(data)[index]] = h;
          }
        });
        paramsdata = { params: getmethoddata };
      } else {
        if (data && data != '' && parse_param) {
          data = parse_param(data);
        }

        for (const p in data) {
          if (!data[p]) {
            data[p] = '';
          }
          if (data[p]) {
            params.append(p, data[p]);
          }
         
        }
        params.append("t", Math.random());
        paramsdata = params;
      }
    }
    let newurl = '';
    if (/http/.test(url)) {
      newurl = url;
    } else {
      newurl = myconfig.indexurl + url;
    }
    getStorage('token').then((token)=>{
        if(token){
            config.headers.Authorization=token;
        }
          axioshooks(newurl, paramsdata, config)
          .then((response) => {
            console.log(response.data, 'response',newurl);
            if (response.data.code == 400) {
              handler(null, response, response.data);
              dispatch({ type: actions.fail, payload: response });
              if(response.data.data&&response.data.data.login&&response.data.data.login == 1){
                deloneStorage('token');
              }else if (response.data.data&&response.data.data.login == "token不存在"||response.data.data.login == "token失效"||response.data.data.error == "token not found") {
                handler(null, response, response.data);
              } 
            
            } else {
              if (response.data) {
                handler(null, response, response.data);
                dispatch({ type: actions.success, payload: response });
              } else {
                dispatch({ type: actions.fail, payload: "服务器数据为空" });
              }
            }
          },(err)=>{
            console.log(err,JSON.stringify(err),"error11");
          })
          .catch((error) => {
            handler(error, null);
            if (!isCancel(error)) {
              dispatch({ type: actions.fail, payload: error });
            }
          });
      });
    return () => {
      source.cancel();
    };
  }, [innerTrigger, outerTrigger]);

  return {
    ...results,
    // @deprecated
    query: () => {
      setInnerTrigger(+new Date());
    },
    reFetch: () => {
      setInnerTrigger(+new Date());
    },
  };
};

const parse_param = function(param = {}, pre_k = '') {
  const rs = {};
  for (let p in param) {
    if (!param[p]) {
      if (pre_k != '') {
        rs[pre_k + '[' + p + ']'] = '';
      } else {
        rs[p] = '';
      }
    } else if (typeof param[p] === 'object') {
      const pk = pre_k != '' ? pre_k + '[' + p + ']' : p;
      Object.assign(rs, parse_param(param[p], pk));
      delete param[p];
    } else {
      if (pre_k != '') {
        rs[pre_k + '[' + p + ']'] = param[p];
      } else {
        rs[p] = param[p];
      }
    }
  }
  return rs;
};
