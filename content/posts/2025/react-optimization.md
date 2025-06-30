---
title: "React 性能优化基础：useCallback、React.memo"
description: "React 性能优化基础：useCallback、React.memo"
date: 2025-06-30 00:00:00
updated: 2025-06-30 00:00:00
type: story
categories: [前端]
tags: ["前端", "React"]
---

在复杂的应用中，不必要的渲染是导致性能问题的常见原因。

当一个组件的 `state` 或 `props` 发生变化，它会重新渲染，更重要的是，当一个父组件重新渲染时，所有子组件也会重新渲染。

如果子组件是一个复杂的组件，重新渲染就会造成性能浪费。

## React.memo

`React.memo` 会对组件的 props 进行浅比较，如果新旧 props 相同，则会复用上一次的渲染结果。

```js
import { memo } from 'react';

const Child = memo(({ name }) => {
    return (
        <div>
            Hello, {name}
        </div>
    );
});

export default Child;
```
现在，只有当 `name` 发生变化时，`Child` 组件才会重新渲染。

## useCallback

每次父组件渲染时，其中定义的函数会被重新创建。

即使函数内容完全一样，他们也是两个不同的函数。这意味着什么？

```js
import { useState } from 'react';

function ParentComponent() {
    const [count, setCount] = useState(0);

    // 每次 ParentComponent 渲染，这个函数都是一个新的实例
    const handleChildClick = () => {
    // ... do something
    };

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>增加Count</button>
            <Child onClick={handleChildClick} />
        </div>
    );
};
```
当组件重新渲染时，`handleChildClick` 函数会被重新创建，即使它没有发生变化，所以子组件还是会重新渲染。

**useCallback 可以解决这个问题**

```js
import { useState, useCallback } from 'react';

function ParentComponent() {
    const [count, setCount] = useState(0);

    // useCallback 会缓存函数实例，只有依赖项变化时才会重新创建
    const handleChildClick = useCallback(() => {
    // ... do something
    }, []); // 空依赖数组表示该函数不依赖任何变量，永远不会重新创建

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>增加Count</button>
            <Child onClick={handleChildClick} />
        </div>
    );
}
```

### 依赖数组的重要性

`useCallback` 的第二个参数是依赖数组，当数组中的任何值发生变化时，函数会被重新创建。

```js
// 当 id 变化时，handleFetch 会被重新创建
const handleFetch = useCallback(() => {
    fetchData(id);
}, [id]);
```

如果函数内部使用了某些外部变量，而这些变量没有被添加到依赖数组中，可能会导致函数使用过时的值。

## React.memo 与 useCallback 结合使用

`React.memo` 和 `useCallback` 结合使用效果最佳：

```js
import { useState, useCallback } from 'react';
import { memo } from 'react';

// 使用 memo 包裹子组件
const Child = memo(({ onClick, name }) => {
    console.log('Child 渲染');
    return (
        <div>
            <button onClick={onClick}>点击我</button>
            <p>Hello, {name}</p>
        </div>
    );
});

function ParentComponent() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('React');
    
    // 使用 useCallback 缓存回调函数
    const handleChildClick = useCallback(() => {
        console.log('按钮被点击');
    }, []);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加 Count</button>
            <Child onClick={handleChildClick} name={name} />
        </div>
    );
}
```

在这个例子中，即使 `ParentComponent` 因为 `count` 状态变化而重新渲染，`Child` 组件也不会重新渲染，因为：
1. `handleChildClick` 函数被 `useCallback` 缓存，不会重新创建
2. `name` 属性没有变化
3. `Child` 组件被 `memo` 包裹，会对 props 进行浅比较

## 总结

性能优化是一个平衡的过程，过度优化可能会使代码变得复杂而难以维护。在实际开发中，应该先确认是否存在性能问题，再有针对性地进行优化。

- 使用 `React.memo` 避免不必要的子组件渲染
- 使用 `useCallback` 缓存函数，避免每次渲染都创建新的函数实例
- 正确设置 `useCallback` 的依赖数组，确保函数使用最新的值
- 将两者结合使用，可以有效减少不必要的渲染

记住，性能优化应该是有的放矢，而不是盲目应用。

