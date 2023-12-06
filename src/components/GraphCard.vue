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

const { rawData } = defineProps(["rawData"])

// chart configuration //
const chartOptions = reactive({
  responsive: true,
  plugins: {
    title: {
      display: true,
      font: {
        size: '16px'
      },
      text: rawData.item // 引入標題
    },
    legend: {
      position: "right",
      labels: {
        // padding: "5px"
      }
  },
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
    }
    else if(label == "rpe") {
      dataObj.borderColor = "rgba(255, 99, 71, .8)"
    } 
    else {
      dataObj.borderColor = "rgb(108, 115, 120, .5)"
      dataObj.borderWidth = 2
    }
    
    
    return dataObj
  })

  return temp
}

</script>

<style lang="sass">
@mixin splitCard($num, $gap: $gap_width)
  width: calc( (100% - ($num - 1) * $gap) / $num )
.graph_card
  // +splitCard(3, 30px)
  width: 50%
  background-color: #fff
  height: 200px
  box-shadow: 0px 6px 10px -4px
  border-radius: 8px
  margin: 0 auto
  margin-bottom: 20px
.chart
  margin: 0 auto
  width: 100%
  // height: 200px

</style>