using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExploreHKMOApi.Migrations
{
    /// <inheritdoc />
    public partial class InitDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Places",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description_Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description_Source = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location_Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location_Latitude = table.Column<double>(type: "float", nullable: false),
                    Location_Longitude = table.Column<double>(type: "float", nullable: false),
                    ImagesJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HoursJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rating = table.Column<double>(type: "float", nullable: true),
                    Ranking = table.Column<int>(type: "int", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Website = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Connection_Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Connection_LocationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Places", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Places");
        }
    }
}
