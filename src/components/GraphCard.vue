<template lang="pug">
.graph_card
  Line(
    class="chart"
    :options="chartOptions" 
    :data="chartData")
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as 
  ChartJS, 
  Title,
  Tooltip, 
  Legend, 
  PointElement, 
  LineElement, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, BarElement,  CategoryScale, LinearScale)
const rawData = reactive({
  item: "硬舉（槓）",
  data: {
    "2023 / 11 / 06": {
      times: [12, 12, 12],
      load: [20, 25, 30],
      rpe: [6, 7, 8],
    },
    "2023 / 11 / 07": {
      times: [12, 12, 12],
      load: [22, 28, 36],
      rpe: [7, 8, 10],
    }
  },
  unit: "kg"
})

// chart configuration //
const chartOptions = reactive({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: rawData.item // 引入標題
    }
  },
  elements: {
    line: {
    },
    point: {
    }
  }
})
const chartData = computed( () => dataProcessor(rawData) )




// methods //
function dataProcessor(raw){
  let { data } = raw
  let temp = {
    labels: null,
    datasets: []
  }

  temp.labels = Object.keys(data)
  
  const labels = [ "load", "times", "rpe" ]
  temp.datasets = labels.map( label => {
    let dataObj = {
      label,
      data: [] 
    }
    // 取得平均值
    for(let [ date, record ] of Object.entries(data)){
      let total = record[label].reduce( (acc, i) => acc + i )
      let avr = total / record[label].length
      dataObj.data.push(avr)
    }

    if(label == "load") {
      dataObj.borderColor = "rgba(53, 89, 143, .8)"
      dataObj.borderWidth = 4
    }
    else if(label == "rpe") {
      dataObj.borderColor = "rgba(255, 99, 71, .8)"
    } 
    else {
      dataObj.borderColor = "rgb(108, 115, 120, .5)"
      dataObj.borderWidth = 1
    }
    
    
    return dataObj
  })

  return temp
}

</script>

<style lang="sass">
.graph_card
  width: 100%
  background-color: #fff
  height: 200px
  box-shadow: 0px 6px 10px -4px
  border-radius: 8px
.chart
  margin: 0 auto
  width: 80%
  // height: 200px

</style>