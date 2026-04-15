import styles from './LoadingSkeleton.module.css';

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.shimmer} ${styles.checkbox}`} />
      <div className={styles.body}>
        <div className={`${styles.shimmer} ${styles.titleBar}`} />
        <div className={`${styles.shimmer} ${styles.descBar}`} />
        <div className={`${styles.shimmer} ${styles.descBarShort}`} />
        <div className={styles.metaRow}>
          <div className={`${styles.shimmer} ${styles.badge}`} />
          <div className={`${styles.shimmer} ${styles.badgeSmall}`} />
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
