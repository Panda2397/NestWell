import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d9e6',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  verifiedBadgeImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain' as const,
  },
  verifiedBadgeWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTooltip: {
    position: 'absolute',
    top: -34,
    right: -4,
    backgroundColor: '#566077',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    zIndex: 10,
  },
  badgeTooltipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1e293b',
  },
  moodText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4f46e5',
  },
});

export default styles;