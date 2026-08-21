using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace flowtrack.DAL.configurations;
public class CategoryConfiguration :IEntityTypeConfiguration<Category>
{
    public void Configure (EntityTypeBuilder<Category> builder)
    {
        builder.Property (c=>c.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property (c=> c.IsActive)
            .HasDefaultValue(true);

        builder.Property (c=> c.CreatedAt)
        .IsRequired();
    }   
}       
