import { Skeleton } from 'twenty-ui/primitives/feedback';

type CardSkeletonProps = {
  sectionHeadings: string[];
};

// Shaped like the content it replaces; headings stay real text.
export const CardSkeleton = ({ sectionHeadings }: CardSkeletonProps) => (
  <div className="kuec-skeleton" aria-busy="true">
    <Skeleton layout="block" width="60%" height={20} />
    <Skeleton layout="block" width="35%" height={14} />
    {sectionHeadings.map((heading) => (
      <div key={heading} className="kuec-card__section">
        <p className="kuec-card__section-heading">{heading}</p>
        <Skeleton layout="block" width="60%" height={14} />
        <Skeleton layout="block" width="35%" height={13} />
      </div>
    ))}
  </div>
);
