using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace flowtrack.DAL.configurations;
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u=> u.Name)
            .HasMaxLength(100);

        builder.Property(u=> u.Email)
            .HasMaxLength(256);

        builder.HasIndex(u=> u.Email)
            .IsUnique();

        builder.Property(u=> u.PasswordHash)
            .HasMaxLength(60)
            .IsFixedLength()
            .IsRequired();

        builder.Property(u=> u.TokenVersion)
            .HasDefaultValue(0)
            .IsRequired();

        builder.Property (u=> u.CreatedAt)
            .IsRequired();
    }
}