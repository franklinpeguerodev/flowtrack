using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace flowtrack.DAL.configurations
{
    public class PaymentMethodConfiguration : IEntityTypeConfiguration<PaymentMethod>
    {
        public void Configure (EntityTypeBuilder<PaymentMethod> builder)
        {
            builder.Property(p => p.Name)
                .HasMaxLength(100)
                .IsRequired();
            builder.Property (p=> p.IsActive)
                .HasDefaultValue(true);
            builder.Property(p=> p.CreatedAt)  
                .IsRequired();
        }
    }
}