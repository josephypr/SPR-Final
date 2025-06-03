package co.com.SPR.models;

public class CredencialesInicio {

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    private String rol;
    private String usuarios;

    private String clave;

    public String getUsuario() {
        return usuarios;
    }

    public void setUsuario(String usuarios) {
        this.usuarios = usuarios;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public CredencialesInicio(String usuarios, String clave, String rol) {
        this.usuarios = usuarios;
        this.clave = clave;
        this.rol = rol;
    }

}
