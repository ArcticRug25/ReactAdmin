import React,{useState} from "react";
import { Card, Button, message } from "antd";
import ReactEcharts from "echarts-for-react";

export default function Bar() {

    const [sales,setSales] = useState([5, 20, 36, 10, 10, 20]),
            [stores,setStores] = useState([6, 10, 25, 20, 15, 10]);

  const update = () => {
      if(stores.indexOf(0) !== -1){
          return message.info('暂无数据更新')
      }
      setSales(sales.map(item=>++item))
      setStores(stores.reduce((pre,item)=>{
          pre.push(--item)
          return pre
      },[]))
  };
  const getOptions = (sales,stores) => {
    return {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data:['销量', '库存']
        },
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: sales
        }, {
          name: '库存',
          type: 'bar',
          data: stores
        }]
      }
  };
  return (
    <div>
      <Card>
        <Button type="primary" onClick={update}>
          更新
        </Button>
      </Card>
      <Card title="柱状图">
        <ReactEcharts option={getOptions(sales,stores)} />
      </Card>
    </div>
  );
}
