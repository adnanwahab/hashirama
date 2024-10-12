# @observablehq/inspector

[![Node CI](https://github.com/observablehq/inspector/workflows/Node%20CI/badge.svg)](https://github.com/observablehq/inspector/actions?workflow=Node+CI)

This library implements the default value renderer for Observable programs. When used with the [Observable runtime](https://github.com/observablehq/runtime) as [observers](https://github.com/observablehq/runtime/blob/main/README.md#observers), inspectors can insert elements into the DOM and render interactive displays for arbitrary values.

To install this library from [npm](https://www.npmjs.com/package/@observablehq/inspector):

```
npm install @observablehq/inspector
```

This library is also available for download [from unpkg](https://unpkg.com/@observablehq/inspector/) as an [ES module](https://unpkg.com/@observablehq/inspector?module) and as a [UMD bundle](https://unpkg.com/@observablehq/inspector/dist/inspector.js).

## API Reference

### Inspectors

An inspector implements the Observable runtime’s [*Observer* interface](https://github.com/observablehq/runtime/blob/main/README.md#observers) by rendering the current value of its associated [variable](https://github.com/observablehq/runtime/blob/main/README.md#variables) to a given DOM element. Inspectors display DOM elements “as-is”, and create interactive “devtools”-style inspectors for other arbitrary values such as numbers and objects.

<a href="#Inspector" name="Inspector">#</a> new **Inspector**(*element*) [<>](https://github.com/observablehq/inspector/blob/main/src/index.js "Source")

Creates a new inspector attached to the specified DOM *element*. See also [Inspector.into](#Inspector_into).

<a href="#inspector_pending" name="inspector_pending">#</a> *inspector*.**pending**() [<>](https://github.com/observablehq/inspector/blob/main/src/index.js "Source")

Applies the `observablehq--running` class to this inspector’s *element*.

<a href="#inspector_fulfilled" name="inspector_fulfilled">#</a> *inspector*.**fulfilled**(*value*) [<>](https://github.com/observablehq/inspector/blob/main/src/index.js "Source")

Inspects the specified *value*, replacing the contents of this inspector’s *element* as appropriate, and dispatching an *update* event. If the specified *value* is a DOM element or text node, and the *value* is not already attached to the DOM, it is inserted into this inspector’s *element*, replacing any existing contents. Otherwise, for other arbitrary values such as numbers, arrays, or objects, an expandable display of the specified *value* is generated into this inspector’s *element*. Applies the `observablehq` class to this inspector’s *element*, and for non-element *value*s, the `observablehq--inspect` class.

<a href="#inspector_rejected" name="inspector_rejected">#</a> *inspector*.**rejected**(*error*) [<>](https://github.com/observablehq/inspector/blob/main/src/index.js "Source")

Inspects the specified *error*, replacing the contents of this inspector’s *element* as appropriate with the error’s description, and dispatching an *error* event. Applies the `observablehq` and `observablehq--error` class to this inspector’s *element*.

<a href="#Inspector_into" name="Inspector_into">#</a> Inspector.**into**(*container*) [<>](https://github.com/observablehq/inspector/blob/main/src/index.js "Source")

Returns a function that when passed a given [*variable*](https://github.com/observablehq/runtime/blob/main/README.md#variables), returns a new [*inspector*](#inspectors) attached to a new DIV element within the specifier *container* element. If *container* is a string, it represents a selector, and the *container* element becomes the matching selected element. This method can be used with [an Observable module definition](https://github.com/observablehq/runtime/blob/main/README.md#_define) as the observer factory to conveniently render an entire program.
