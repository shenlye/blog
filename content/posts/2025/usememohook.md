---
title: "useMemo VS useState + useEffect：避免额外渲染"
description: "使用useMemo优化性能，避免因状态更新而触发额外的渲染"
date: 2025-06-30 00:00:00
updated: 2025-06-30 00:00:00
type: story
categories: [前端]
tags: ["前端", "React"]
---

如果说我要根据一个值的改变重新计算结果，在不知道useMemo的情况下，我会使用useState+useEffect。
```tsx
import { useState, useEffect } from 'react';

export default function App() {
    console.log("App render");
    const [value, setValue] = useState(0);
    const [result, setResult] = useState(0);

    useEffect(() => {
        setResult(value * 10);
    }, [value]);
    return (
        <div>
            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} />
            <p>{result}</p>
        </div>
    )
}
```
从结果上来看，使用useEffect+useState和useMemo是一样的，这正是他们两个容易被混淆的原因。

真正的区别在于渲染过程和性能，因为这个例子过于微小，性能差异可以忽略不计。

但是注意代码里的`console.log("App render")`，在上述代码中改变值，查看控制台会发现他出现了两次

- 1.第一次渲染：value变化触发组件渲染
- 2.useEffect：value变化触发useEffect，调用setResult
- 3.第二次渲染：result变化触发组件渲染

一共触发两次渲染，严格模式下会触发四次渲染。

## 如何避免额外渲染？

使用到了我新学的hook，useMemo
```tsx
import { useState, useMemo } from 'react';

export default function App() {
    console.log("App render");
    const [value, setValue] = useState(0);
    const result = useMemo(() => value * 10, [value]);
    return (
        <div>
            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} />
            <p>{result}</p>
        </div>
    )
}
```
使用useMemo后，控制台只会打印一次"App render"，因为：

1. 计算的结果在渲染阶段直接得出，不需要额外的状态更新
2. useMemo会缓存计算结果，只有当依赖数组中的值（这里是value）发生变化时，才会重新计算

## useMemo的应用场景

除了避免额外渲染外，useMemo还适用于以下场景：

1. **昂贵的计算**：当计算过程复杂或数据量大时，可以避免不必要的重复计算
   ```tsx
   const sortedData = useMemo(() => {
     return [...largeArray].sort((a, b) => a - b);
   }, [largeArray]);
   ```

2. **避免子组件不必要的重渲染**：与React.memo结合使用
   ```tsx
   const memoizedValue = useMemo(() => ({
     complex: 'object',
     with: 'properties'
   }), [/* 依赖项 */]);
   
   return <ChildComponent data={memoizedValue} />;
   ```

3. **引用相等性依赖**：当其他hooks依赖于对象或数组的引用相等性时
   ```tsx
   const options = useMemo(() => ({
     method: 'GET',
     headers: { Authorization: `Bearer ${token}` }
   }), [token]);
   
   useEffect(() => {
     fetchData(options);
   }, [options]); // 只有当options真正改变时才会重新请求
   ```

## 注意项

- 1.简单计算直接计算比useMemo更高效，过度使用useMemo可能导致性能下降
- 2.严格模式下StrictMode会故意进行二次渲染来帮助发现问题
- 3.useMemo是一种优化手段，不应该有副作用（如修改状态或DOM）

## 总结

useMemo和useState+useEffect的主要区别：

| 特性 | useState + useEffect | useMemo |
| --- | --- | --- |
| 渲染次数 | 两次（值变化一次，结果变化一次） | 一次（只在值变化时） |
| 执行时机 | useEffect在渲染后执行 | 在渲染过程中执行 |
| 缓存机制 | 无内置缓存 | 自动缓存计算结果 |
| 适用场景 | 需要副作用（如API调用） | 纯计算、避免重渲染 |

在实际开发中，应根据具体需求选择合适的方案，避免过度优化带来的复杂性。
