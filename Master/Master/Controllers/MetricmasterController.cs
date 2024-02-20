using Master.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Master.Controllers
{
    public class MetricmasterController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get()
        {
            string query = @"SELECT Id, IsMandatory, metricid, name FROM dbo.Metricmaster";
            DataTable table = new DataTable();
            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["MasterAppDB"].ConnectionString))
            using (var cmd = new SqlCommand(query, con))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.Text;
                con.Open();
                da.Fill(table);
            }
            return Request.CreateResponse(HttpStatusCode.OK, table);
        }

        [HttpPut]
        public string UpdateMetrics(List<Metricmaster> data)
        {
            try
            {
                string query = @"
                    UPDATE dbo.Metricmaster
                    SET IsMandatory = @IsMandatory
                    WHERE metricid = @metricid
                ";

                using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["MasterAppDB"].ConnectionString))
                using (var cmd = new SqlCommand(query, con))
                {
                    cmd.CommandType = CommandType.Text;
                    con.Open();

                    // Iterate over all data elements, not just skipping the header
                    foreach (var item in data)
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@metricid", item.metricid);
                        cmd.Parameters.AddWithValue("@IsMandatory", item.IsMandatory);
                        cmd.ExecuteNonQuery();
                    }
                }

                return "Successfully updated";
            }
            catch (Exception ex)
            {
                return "Failed to Update: " + ex.Message;
            }
        }
    }
}
