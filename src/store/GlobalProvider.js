import React, {useState} from 'react';

const GlobalContext = React.createContext();

const GlobalProvider = (props) => {

  //const url = 'http://113.161.165.122:1123/';//link chính biwase
  const url = 'http://192.168.40.75:80/';//link chính localhost
  //const url = 'http://113.161.128.34:8112/';//link test sql 20.251 eosbd

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [p1, setP1] = useState('5698BSM00ABENDnnnGTMyyyyy1123Keyword');
  const [p2, setP2] = useState('ABCDEFGHIJKLMNOPQRSTUVWXYZ23242SecurityKey');
  const [p3, setP3] = useState('any.source@character#exceptPassword');
  const [p4, setP4] = useState('substr_count.Since substr_countPaseKey');
  const [p5, setP5] = useState('Anobviousexample@of.where0you1might2needSimpleKey');
  const [fullname, setFullname] = useState('');
  const [makv, setMakv] = useState('');
  const [macv, setMacv] = useState('');
  const [listloaixl, setListloaixl] = useState([{}]);  
  const [listloaidongho, setListloaidongho] = useState([{}]);  
  const [list_suachua_initial, setList_suachua_initial] = useState([]);
  const [list_thicong_initial, setList_thicong_initial] = useState([]);
  const [list_suachua_chuaphancong_initial, setList_suachua_chuaphancong_initial] = useState([]);
  const [list_thicong_chuaphancong_initial, setList_thicong_chuaphancong_initial] = useState([]);
  return (
    <GlobalContext.Provider
      value={{
        url,
        username,
        password,
        p1,
        p2,
        p3,
        p4,
        p5,
        fullname,
        makv,
        macv,
        listloaixl,
        listloaidongho,          
        list_suachua_initial,
        list_thicong_initial,
        list_suachua_chuaphancong_initial,
        list_thicong_chuaphancong_initial,
        setUsername,
        setPassword,
        setFullname,
        setMakv,
        setMacv,
        setListloaixl,       
        setListloaidongho,        
        setList_suachua_initial,
        setList_thicong_initial,
        setList_suachua_chuaphancong_initial,
        setList_thicong_chuaphancong_initial
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export {GlobalProvider, GlobalContext};
