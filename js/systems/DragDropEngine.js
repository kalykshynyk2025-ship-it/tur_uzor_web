export class DragDropEngine {
  constructor(root) {
    this.root = root;
    this.active = null;
  }

  makeDraggable(node, onDrop) {
    const start = (clientX, clientY) => {
      const rect = node.getBoundingClientRect();
      this.active = {
        node,
        dx: clientX - rect.left,
        dy: clientY - rect.top,
        onDrop
      };
      node.classList.add('dragging');
      node.style.position = 'fixed';
      node.style.zIndex = '6';
      move(clientX, clientY);
    };

    const move = (clientX, clientY) => {
      if (!this.active) return;
      node.style.left = `${clientX - this.active.dx}px`;
      node.style.top = `${clientY - this.active.dy}px`;
    };

    const end = (clientX, clientY) => {
      if (!this.active) return;
      const data = this.active;
      node.classList.remove('dragging');
      data.onDrop({ x: clientX, y: clientY, node });
      this.active = null;
    };

    node.addEventListener('pointerdown', (e) => {
      node.setPointerCapture(e.pointerId);
      start(e.clientX, e.clientY);
    });
    node.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
    node.addEventListener('pointerup', (e) => end(e.clientX, e.clientY));
    node.addEventListener('pointercancel', (e) => end(e.clientX, e.clientY));
  }
}
