class DoublyNode<T> {
    data: T;
    next: DoublyNode<T> | null = null;
    prev: DoublyNode<T> | null = null;

    constructor(data: T) {
        this.data = data;
    }
}

class DoublyLinkedList<T> {
    head: DoublyNode<T> | null = null;
    tail: DoublyNode<T> | null = null;

    append(data: T): void {
        const newNode = new DoublyNode(data);
        if (this.tail === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    prepend(data: T): void {
        const newNode = new DoublyNode(data);
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
    }

    print(): void {
        let current = this.head;
        const values: T[] = [];
        while (current) {
            values.push(current.data);
            current = current.next;
        }
        console.log(values.join(' <-> '));
    }
}
