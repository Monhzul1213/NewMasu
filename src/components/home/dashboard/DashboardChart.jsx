import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

import { formatNumber, graphList } from "../../../helpers";
import { AreaChart, BarChart, ChartTab, Empty1, PlainSelect } from "../../all";

export function DashboardChart(props){
  const { pgWidth, sales, graphData } = props;
  const { t } = useTranslation();
  const [tab, setTab] = useState('totalSalesAmt');
  const [width, setWidth] = useState(1045);
  const [isBar, setIsBar] = useState(true);
  const currency = useSelector(state => state.login?.user?.msMerchant?.currency ?? '');

  useEffect(() => {
    setWidth(pgWidth >= 1310 ? 1045 : pgWidth);
    return () => {};
  }, [pgWidth]);

  const xFormatter = value => value + ':00';

  const tickFormatter = tick => {
    if(tick >= 1000) return formatNumber(tick / 1000, 0) + currency;
    else return formatNumber(tick / 1000, 2) + currency;
  }

  const id = pgWidth >= 400 ? 'rr_large' : 'rr_small';
  const tabProps = { tab, setTab, title: 'home' };
  const chartProps = {
    className: 'chart_back', style: { width: width - 2 },
    data: graphData,
    dataKey: 'salesDate',
    xFormatter, tickFormatter,
    tipFormatter: value => [formatNumber(value) + currency, t('report.home_' + tab)],
    bars: [{ color: '#4BAF4F', fill: '#4BAF4F55', key: tab }]
  };

  return (
    <div className='dash_graph_cont' id={id} style={{ width }}>
      <div className='rr_card_back'>
        <ChartTab label='totalSalesAmt' value={sales?.salesAmt} {...tabProps} />
        <ChartTab label='invoiceAmt' value={sales?.invoiceAmt} {...tabProps} />
        <ChartTab label='pending' value={sales?.pending} {...tabProps} />
        <ChartTab label='pure' value={sales?.pure} {...tabProps} />
        <ChartTab label='margin' value={sales?.margin} {...tabProps} />
      </div>
      <div>
        <div className='rr_graph_header'>
          <p className='rr_graph_title'>{t('report.home_' + tab)} <span className='rr_graph_sub'>{t('report.thousand')}</span></p>
          <div className='row' style={{ gap: '10px' }}>
            <PlainSelect
              className='dash_graph_select'
              value={isBar}
              setValue={setIsBar}
              data={graphList} />
          </div>
        </div>
        {graphData?.length ? isBar
          ? <BarChart {...chartProps} /> : <AreaChart {...chartProps} />
          : <Empty1 icon='MdBarChart' id='chart_empty' text={t('report.no_filter')}/>}
      </div>
    </div>
  );
}