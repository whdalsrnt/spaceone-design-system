<template>
    <fragment>
        <div class="flex justify-between">
            <span class="text-sm font-bold capitalize">{{ title }}</span>
            <span class="text-sm text-gray flex-grow">&nbsp; {{ unit.y | yUnit }}</span>
            <p-lottie v-if="loading && chart" name="spinner" auto />
        </div>
        <p-chart-loader :loading="loading && !chart" class="chart">
            <template #loader>
                <p-skeleton height="100%" />
            </template>
            <canvas ref="chartRef" />
            <transition name="fade-in">
                <div v-if="error || (loading && chart)" class="shade">
                    <p v-if="error">
                        Unavailable
                    </p>
                </div>
            </transition>
        </p-chart-loader>
    </fragment>
</template>

<script lang="ts">
import {
    defineComponent, reactive, toRefs, watch,
} from '@vue/composition-api';
import { MetricChartProps, metricChartProps } from '@/components/organisms/charts/metric-chart/MetricChart.toolset';
import { SLineChart } from '@/lib/chart/line-chart';
import PChartLoader from '@/components/organisms/charts/chart-loader/ChartLoader.vue';
import _ from 'lodash';
import { gray } from '@/styles/colors';
import { NSChart, tooltips } from '@/lib/chart/s-chart';
import { chartTimestampFormatter } from '@/lib/util';
import PSkeleton from '@/components/atoms/skeletons/Skeleton.vue';
import PLottie from '@/components/molecules/lottie/PLottie.vue';
import { UnwrapRef } from '@vue/composition-api/dist/reactivity';
import { ChartColor, ChartDataSets } from 'chart.js';

export default defineComponent({
    name: 'PMetricChart',
    filters: {
        yUnit(unit: string) {
            return unit ? `(${unit})` : '';
        },
    },
    components: { PLottie, PSkeleton, PChartLoader },
    props: metricChartProps,
    setup(props: MetricChartProps) {
        const getLabels = () => {
            if (props.unit.x === 'Timestamp') {
                const labels: string[] | string[][] = props.labels.map(t => chartTimestampFormatter(t));
                labels.forEach((e, i, a: string[] | string[][]) => {
                    if (typeof e === 'string' && /\n/.test(e)) {
                        a[i] = e.split(/\n/);
                    }
                });
                return labels;
            }
            return props.labels;
        };

        const state: UnwrapRef<any> = reactive({
            chartRef: null,
            chart: null,
        });
        const drawChart = (canvas) => {
            const datasets: ChartDataSets[] = _.map(props.dataset, (d, k) => ({ data: d, label: k }));

            state.chart = new NSChart(canvas, {
                type: 'line',
                data: {
                    labels: getLabels(),
                    datasets,
                },
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                    },
                    scales: {
                        yAxes: [{
                            gridLines: {
                                display: true,
                                drawTicks: false,
                                drawBorder: true,
                                color: gray[200],
                                zeroLineColor: gray[200],
                            },
                            ticks: {
                                display: true,
                                autoSkip: true,
                                autoSkipPadding: 20,
                                padding: 10,
                                suggestedMin: 0,
                                fontColor: gray[900],
                                fontSize: 12,
                            },
                        }],
                        xAxes: [{
                            gridLines: {
                                display: true,
                                drawTicks: false,
                                drawBorder: true,
                                color: gray[200],
                                zeroLineColor: gray[200],
                                offsetGridLines: false,
                            },
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 50,
                                padding: 10,
                                maxRotation: 0,
                                fontColor: gray[900],
                                fontSize: 12,
                            },
                            afterTickToLabelConversion(scaleInstance): void {
                                scaleInstance.ticks[0] = null;
                                scaleInstance.ticks[scaleInstance.ticks.length - 1] = null;
                            },
                        }],
                    },
                    tooltips: {
                        ...tooltips,
                        mode: 'point',
                    },
                },
                plugins: [{
                    beforeDraw(chart: SLineChart): void {
                        const ctx: CanvasRenderingContext2D | null = chart.ctx;
                        if (!ctx) return;

                        ctx.save();

                        ctx.strokeStyle = gray[200];
                        ctx.lineWidth = 1;

                        ctx.beginPath();
                        ctx.moveTo(chart.chartArea.right, chart.chartArea.top);
                        ctx.lineTo(chart.chartArea.right, chart.chartArea.bottom);
                        ctx.stroke();

                        ctx.restore();
                    },
                }],
            }, {
                borderWidth: 1,
                fill: false,
                pointRadius: 0,
                pointBorderWidth: 0,
                lineTension: 0,
                borderColor: ({ datasetIndex }): ChartColor => props.colors[datasetIndex || 0],
            });
        };


        watch([() => state.chartRef, () => props.loading], ([ctx, loading]) => {
            if (ctx && !loading) {
                drawChart(ctx);
            }
        }, {
            lazy: true,
        });

        watch(() => props.dataset, () => {
            if (state.chart) {
                _.forEach(props.dataset, (ds, label) => {
                    state.chart.upsertData(ds, label);
                    state.chart.setLabels(getLabels());
                });
                state.chart.update();
            }
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style lang="postcss" scoped>
    .chart {
        @apply mt-5 relative px-2;
        height: 12.5rem;
    }
    .shade {
        @apply absolute opacity-50 bg-white w-full h-full flex items-center justify-center;
        bottom: 0;
    }
    .fade-in-enter-active, .fade-in-leave-active {
        transition: opacity 0.5s;
    }
    .fade-in-enter, .fade-in-leave-to {
        opacity: 0;
    }
    .fade-in-enter-to, .fade-in-leave {
        opacity: 0.5;
    }
</style>
