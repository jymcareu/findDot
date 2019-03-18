/**
 * Created by GYL on 2018/7/6
 */
import React, {Component} from 'react';
import {message, notification,Input,InputNumber,Icon } from 'antd';
import styles from './createTemp.less';
import MyTable from "../../components/MyTable";
import Filtrate from "../../components/Filtrate";
import Container from "../../components/Container";
import MyIcon from "../../components/MyIcon";
const EditableCell = ({ type, value, onChange}) => (
  <div>
    {
      type === 'Input' &&
      <Input value={value} onChange={e => onChange(e.target.value)} />
    }
    {
      type === 'InputNumber' &&
      <InputNumber
        style={{width:'100%'}}
        min={0}
        max={100}
        step={0.1}
        formatter={value => `${value}%`}
        value={value}
        onChange={value => onChange(value)}
      />
    }

  </div>
);
let num = 0;
class CreateTemp extends Component {
  state = {
    dataSource:[],
    type:'0', // 0为圆点 1为数据
  };
  componentDidMount(){
    let dataSource = [];
    num = 0;
    dataSource.map((item, index) => {
      item.key = index +1;
      item.num = index +1;
      this.createDiv(item.left,item.top)
    });
    this.setState({
      dataSource
    });
  };
  // 生成代码
  setBatch = () => {
    let {dataSource} = this.state;
    if (dataSource.length === 0){
      message.warning('请先创建你要生成的数据！');
      return;
    }
    let outValue = [];
    dataSource.map((item, index) => {
      outValue.push({
        left:`${item.left?((item.left.toString().substr(item.left.length-1) === '%')?item.left:item.left+'%'):''}`,
        top:`${item.top?((item.top.toString().substr(item.top.length-1) === '%')?item.top:item.top+'%'):''}`,
        type:`${item.type}`,
      })
    });
    let oInput = document.createElement('input');
    oInput.value = JSON.stringify(outValue);
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    document.body.removeChild(oInput);
    notification.open({
      message:'复制成功',
      description:JSON.stringify(outValue),
      placement:'topLeft',
      duration:2,
      icon: <Icon type="smile-circle" style={{ color: '#1279ee' }} />,
    });
  };
  // 鼠标移动
  onMove = (event) => {
    let t = this;
    let top,left,width,height,line,X,Y,oDiv,info;
    oDiv = document.getElementById('warp');
    line = document.getElementById('line');
    info = document.getElementById('info');
    width = oDiv.offsetWidth;
    height = oDiv.offsetHeight;
    top=t.getY(oDiv);
    left=t.getX(oDiv);
    X = (Math.round((event.clientX-left) / width * 10000) / 100.00-0.6).toFixed(1)+"%";
    Y = (Math.round((event.clientY-top) / height * 10000) / 100.00-1.3).toFixed(1)+"%";
    document.getElementById("mp_x").innerHTML = X;
    document.getElementById("mp_y").innerHTML = Y;
    line.style.width = X;
    line.style.height = Y;
    info.style.left = (Math.round((event.clientX-left) / width * 10000) / 100.00+0.6).toFixed(1)+"%";
    info.style.top = (Math.round((event.clientY-top) / height * 10000) / 100.00+1.3).toFixed(1)+"%";
  };
  // 获取X
  getX = (obj) =>{
    let parObj = obj;
    let left = obj.offsetLeft;
    while(parObj=parObj.offsetParent){
      left+=parObj.offsetLeft;
    }
    return left;
  };
 // 获取Y
  getY = (obj) => {
    let parObj = obj;
    let top = obj.offsetTop;
    while(parObj = parObj.offsetParent){
      top+=parObj.offsetTop;
    }
    return top;
  };
  // 点击生成内容
  copyUrl = () =>{
    let t = this;
    let oInput = document.createElement('input');
    let left = document.getElementById("mp_x").innerHTML;
    let top = document.getElementById("mp_y").innerHTML;
    oInput.value = 'left:"'+left+'",top:"'+top+'"';
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    document.body.removeChild(oInput);
    t.createDiv(left,top);
  };
  // 生成div
  createDiv = (left,top) => {
    let t = this;
    let {dataSource} = t.state;
    let oDiv = document.getElementById('warp');
    let newDiv = document.createElement('div');
    newDiv.innerHTML=++num;
    newDiv.className = 'newDiv';
    newDiv.style.left = left;
    newDiv.style.top = top;
    oDiv.appendChild(newDiv);
    dataSource.push({
      key:num,
      num:num,
      left,
      top,
      type:''
    });
    t.setState({
      dataSource
    })
  };
  // 删除点位
  onDel =(i) => {
    let t = this;
    let {dataSource} = t.state;
    let oDiv = document.getElementById('warp');
    let newDivList = document.getElementsByClassName('newDiv');
    dataSource.splice(i,1);
    oDiv.removeChild(newDivList[i]);
    t.setState({
      dataSource
    })
  };
  // 鼠标进入
  onOver = (event) => {
    let line = document.getElementById('line');
    let info = document.getElementById('info');
    line.style.display = 'block';
    info.style.display = 'block';
  };
  // 鼠标离开
  onOut = (event) => {
    let line = document.getElementById('line');
    let info = document.getElementById('info');
    line.style.display = 'none';
    info.style.display = 'none';
  };
  // 表格输入
  renderColumns(text, record, column,type, index) {
    return (
      <EditableCell
        type={type}
        value={text}
        onChange={value => {
          this.handleChange(value, record.key, column);
          this.upPosition(column, value, index);
        }}
      />
    );
  };
  // 改变点位的位置 type:'left || top' value:'值' i:'点位下标'
  upPosition = (type,value,i) => {
    let newDivList = document.getElementsByClassName('newDiv');
    newDivList[i].style[type] = value+'%';
  };
  // 输入框改变
  handleChange(value, key, column) {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ dataSource:newData });
    }
  };
  render(){
    let t = this;
    let {dataSource} = t.state;
    //下拉参数
    const items = [
      {
        type: 'select',
        label: '类型',
        paramName: 'projectCompanyId',
        initialValue:'1',
        options: [
          {text:'圆',value:'1'},
          {text:'框',value:'2'},
        ],
      }
    ];
    const columns =[
      {
        dataIndex: 'num',
        title: '序号',
        key: 'num',
        width: 50,
      }, {
        dataIndex: 'left',
        title: 'Left',
        key: 'left',
        width: 90,
        render: (text, record, index) => this.renderColumns(text, record,'left','InputNumber',index),
      }, {
        dataIndex: 'top',
        title: 'Top',
        key: 'top',
        width: 90,
        render: (text, record, index) => this.renderColumns(text, record,'top','InputNumber',index),
      }, {
        dataIndex: 'type',
        title: '值',
        key: 'type',
        width: 100,
        render: (text, record, index) => this.renderColumns(text, record,'type','Input',index),
      }, {
        dataIndex: 'index',
        title: '操作',
        key: 'index',
        width: 50,
        render:(text, record, index)=>{
          return(
            <span><MyIcon onClick={t.onDel.bind(t,index)} type={'icon-del'} style={{color:'#ff4650',cursor:'pointer'}}/></span>
          )
        }
      }
    ];
    const extraBtn =[
      {
        icon:'icon-daochu',
        name:'生成',
        iconStyle:{color:'#3c8fff',fontSize:14},
        funName:'setBatch'
      },
    ];
    return(
      <div className={styles.container}>
        <div className={styles.header}></div>
        <div className={styles.left}>
          <Container
            extraBtn={extraBtn}
            setBatch={t.setBatch.bind(t)}>
          <MyTable
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={false}
            scroll={{y:750,}}
          />
          </Container>
        </div>
        <div className={styles.content}>
          <Filtrate items={items} clearBtn={'hide'}/>
          <div className={styles.contentWp} onMouseOver={t.onOver} onMouseOut={t.onOut} onMouseMove={t.onMove} id="warp" onClick={t.copyUrl}>
            <div id="line" className={styles.line}/>
            <div className={styles.info} id="info">
              <div>left: <span id={"mp_x"}></span></div>
              <div>top: <span id={"mp_y"}></span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default CreateTemp;
