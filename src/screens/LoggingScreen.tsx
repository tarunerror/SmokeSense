import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import { useTheme } from '@/design-system';
import { Button, Card, Text } from '@/components/ui';
import { useDataLayer } from '@/services/db/DataLayerProvider';
import type { LogEvent } from '@/services/db/repositories';

export function LoggingScreen() {
  const theme = useTheme();
  const { repositories } = useDataLayer();

  const [items, setItems] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const list = await repositories.logEvents.list(50);
    setItems(list);
  }, [repositories.logEvents]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onAdd = useCallback(async () => {
    setLoading(true);
    try {
      await repositories.logEvents.create('Noted. Small steps count.');
      await refresh();
    } finally {
      setLoading(false);
    }
  }, [refresh, repositories.logEvents]);

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Card style={{ marginBottom: theme.spacing.lg }}>
        <Text variant="subtitle" style={{ marginBottom: theme.spacing.sm }}>
          Quick log
        </Text>
        <Text muted style={{ marginBottom: theme.spacing.lg }}>
          A lightweight, offline-first timeline. This is scaffolding only.
        </Text>
        <Button label="Add supportive note" loading={loading} onPress={onAdd} />
      </Card>

      <Text variant="subtitle" style={{ marginBottom: theme.spacing.sm }}>
        Recent
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
        renderItem={({ item }) => (
          <Card padded>
            <Text style={{ marginBottom: theme.spacing.xs }}>{item.message}</Text>
            <Text variant="caption" muted>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Card>
        )}
      />
    </View>
  );
}
