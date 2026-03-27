<template>
    <div class="chart-imodel-check">
        <div class="chart-imodel-check-title">
            <div>构件数量：{{ errorData.componentNum }} </div>
            <div>问题总数量：{{ errorData.problemNum }} </div>
            <div>文件级问题数量：{{ errorData.fileProblemNum }}</div>
            <div>构件级问题数量：{{ errorData.componentProblemNum }}</div>
        </div>
        <!-- echarts 饼状图 -->
        <div class="chart-imodel-check-show" id="chartsImodelCheck"></div>
    </div>
</template>
<script>
export default {
    name: "showDataCharts",
    props: {},
    data() {
        return {
            errorData: {
                componentNum: 0,
                problemNum: 0,
                fileProblemNum: 0,
                componentProblemNum: 0,
            },
        };
    },
    mounted() {

    },
    methods: {
        // 初始化饼状图echarts
        initEcharts(data) {
            this.errorData = data.errorData;

            let myChart = this.$echarts.init(
                document.getElementById("chartsImodelCheck")
            );
            let option = {
                title: {
                    
                },
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    orient: "horizontal",
                    left: "center",
                    top: "32",
                },
                series: [
                    {
                        name: "问题数量",
                        type: "pie",
                        radius: "50%",
                        data: data.chartsData, 
                            //[
                            // { value: 1048, name: "Search Engine", itemStyle: { color: this.colorList[0] } },
                            // { value: 735, name: "Direct", itemStyle: { color: this.colorList[1] } },
                            // { value: 580, name: "Email", itemStyle: { color: this.colorList[2] } },
                            // { value: 484, name: "Union Ads", itemStyle: { color: this.colorList[3] } },
                            // ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            };
            myChart.setOption(option);
        },
    },
};
</script>
<style lang="scss" scoped>
.chart-imodel-check {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .chart-imodel-check-title {
        width: 100%;
        height: 160px;
        font-size: 14px;
        padding-left: 50px;
        padding-top: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .chart-imodel-check-show {
        width: 100%;
        flex: 1;
    }
}
</style>
