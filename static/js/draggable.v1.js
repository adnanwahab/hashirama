// From http://www.redblobgames.com/x/1845-draggable/
// Copyright 2017 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

/** OLD INTERFACE I developed in early 2017. I tried it for a few
    projects, noted the awkward parts, and redesigned it in late 2018.
    See <https://www.redblobgames.com/x/1845-draggable/> for rationale

    TODO: rewrite this to be a wrapper around the new interface

    reference element: does not move during drag, defines coordinate system
    element: may move, gets mousedown handler
    handler: function called with (begin, current, state)
    where state is the value returned last time handler called, or null
    the first time

    makeDraggable returns an object with a cleanup function that will remove the
    dragging event handlers.
*/
function makeDraggable(reference, element, handler) {
  let touch_begin = [];
  let touch_state = [];
  let on_drag_end = () => {};

  // NOTE: this doesn't take into account css transforms
  // <https://bugzilla.mozilla.org/show_bug.cgi?id=972041>
  function coords(rect, e) {
    let coords = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const svg =
      reference instanceof SVGSVGElement
        ? reference
        : reference.ownerSVGElement;
    if (svg) {
      // NOTE: svg.getScreenCTM already factors in the bounding rect
      // so there's no need to subtract rect, or even call getBoundingClientRect
      let point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      coords = point.matrixTransform(svg.getScreenCTM().inverse());
    }
    return coords;
  }

  // TODO: do I need both preventDefault and stopPropagation? dunno

  let cleanup = () => null;
  function mouseDown(e) {
    if (e.button != 0) {
      return; /* don't trap right click */
    }
    const rect = reference.getBoundingClientRect();
    const begin = coords(rect, e);
    let state = handler(begin, begin, null);

    function mouseMove(e) {
      state = handler(begin, coords(rect, e), state);
      e.preventDefault();
      e.stopPropagation();
    }

    function mouseUp(e) {
      cleanup();
      e.preventDefault();
      e.stopPropagation();
      on_drag_end(begin, coords(rect, e), state);
    }

    cleanup = () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
      cleanup = () => null;
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
    e.preventDefault();
    e.stopPropagation();
  }

  function touchEvent(e) {
    const rect = reference.getBoundingClientRect();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      let current = coords(rect, touch);
      if (e.type == "touchstart") {
        touch_begin[touch.identifier] = current;
        touch_state[touch.identifier] = handler(current, current, null);
      } else {
        let begin = touch_begin[touch.identifier];
        let state = touch_state[touch.identifier];
        touch_state[touch.identifier] = handler(begin, current, state);
        if (e.type == "touchend") {
          on_drag_end(begin, coords(rect, e), state);
        }
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }

  element.style.touchAction = "none";
  element.addEventListener("mousedown", mouseDown);
  element.addEventListener("touchstart", touchEvent);
  element.addEventListener("touchmove", touchEvent);
  element.addEventListener("touchend", touchEvent);

  return {
    cleanup() {
      element.removeEventListener("mousedown", mouseDown);
      element.removeEventListener("touchstart", touchEvent);
      element.removeEventListener("touchmove", touchEvent);
      element.removeEventListener("touchend", touchEvent);
      cleanup();
    },
    onDragEnd(f) {
      on_drag_end = f;
    },
  };
}
