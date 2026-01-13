interface EditableListProps<T> {
  items: T[];
  getKey(item: T): React.Key;
  onAdd(): void;
  onRemove(index: number): void;
  renderItem(item: T, index: number): React.ReactNode;
  emptyState?: React.ReactNode;
}

export function EditableList<T>({
  items,
  getKey,
  onAdd,
  onRemove,
  renderItem,
  emptyState
}: EditableListProps<T>) {
  if (items.length === 0) return <>{emptyState}</>;

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={getKey(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
