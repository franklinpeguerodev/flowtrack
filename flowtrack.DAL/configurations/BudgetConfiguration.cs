
using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace flowtrack.DAL.configurations;
public class BudgetConfiguration : IEntityTypeConfiguration<Budget> 
{
    public void Configure (EntityTypeBuilder <Budget> builder)
    {
        builder.Property (b=> b.Amount)
        .HasPrecision(18,2);
        builder.Property (b=> b.CreatedAt)
        .IsRequired();
    
        
    }
}