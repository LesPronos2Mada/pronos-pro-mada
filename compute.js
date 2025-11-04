function poissonP(k, lambda){
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}
const factCache = [1];
function factorial(n){
  if (factCache[n] != null) return factCache[n];
  let v = factCache[factCache.length-1];
  for (let i=factCache.length;i<=n;i++){ v *= i; factCache[i]=v; }
  return factCache[n];
}
export function outcomeProbs(xgHome, xgAway){
  let pH=0, pD=0, pA=0, over25=0, expScoreDiff=0;
  for (let s1=0;s1<=7;s1++){
    for (let s2=0;s2<=7;s2++){
      const p = poissonP(s1,xgHome)*poissonP(s2,xgAway);
      if (s1>s2) pH += p;
      else if (s1===s2) pD += p;
      else pA += p;
      if (s1+s2 >= 3) over25 += p;
      expScoreDiff += (s1 - s2)*p;
    }
  }
  return { pH, pD, pA, over25, expScoreDiff };
}