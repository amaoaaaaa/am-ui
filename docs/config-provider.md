<script setup>
import { defineAsyncComponent } from 'vue'

const ConfigEnablePageScale = defineAsyncComponent(() => import('./components/DemoConfigProvider/ConfigEnablePageScale.vue'))
</script>


# Config Provider 全局配置

Config Provider 用来提供全局的配置选项

## Props

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| config | [`AmConfig`](#amconfig) \| undefined | — | 配置选项 |

## AmConfig

| 配置项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| [enablePageScale](#配置自动缩放) | boolean \| undefined | true | 是否启用页面缩放 |
| [designHeight](#配置设计稿高度) | number \| undefined | 1080 | 设计稿高度 |

### 配置自动缩放

> 为什么需要这个配置项？
> - 为了解决在不同分辨率屏幕下都能保证页面内容比例与设计稿一致。

配置项 `enablePageScale` 为 `true` 时，会自动计算页面相对于 `designHeight` 缩放比例，控制组件的尺寸。

启用后，在**非全屏**下会缩小一点，因为配置的设计稿高度是 1080。

<ClientOnly>
    <ConfigEnablePageScale />
</ClientOnly>

### 配置设计稿高度

配置项 `designHeight` 为设计稿高度，默认为 1080。

缩放会使用 `window.innerHeight / designHeight` 来计算。