using flowtrack.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace flowtrack.DAL.configurations;
public class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
{
    public void Configure (EntityTypeBuilder<Expense> builder)
    {
        builder.Property (e=> e.Amount)
        .HasPrecision(18,2);
    }
}