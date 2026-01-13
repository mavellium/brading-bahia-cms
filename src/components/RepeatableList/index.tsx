interface RepeatableListProps<T> {
  items: T[];
  getId: (item: T) => number | string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
}

export function RepeatableList<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  emptyState
}: RepeatableListProps<T>) {
  if (!items.length) return <>{emptyState}</>;

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
