import React from "react";
import { useSelector } from "react-redux";

import { formatNumber } from "../../helpers/helper";

export function Money(props){
  const { value, fontSize, decimal, currency, currency1 } = props;
  const user = useSelector(state => state.login?.user);

  return (
    <span>
      {formatNumber(value, decimal)}
      <span style={{ fontSize: fontSize ?? 11}}>{currency1 ?? user?.msMerchant?.currency ?? currency ?? ''}</span>
    </span>
  );
}