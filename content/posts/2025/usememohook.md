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
export default function App() {
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
计算的结果在渲染阶段直接得出，不触发额外渲染。

自动缓存结果，依赖为变化复用旧值。

## 注意项
- 1.简单计算直接计算比useMemo更高效
- 2.严格模式下StrictMode会故意进行二次渲染来帮助发现问题
