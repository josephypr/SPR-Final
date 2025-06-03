package co.com.SPR.stepsdefinitions;

import co.com.SPR.models.DatosActualizar;
import co.com.SPR.tasks.ActualizarContratista;
import co.com.SPR.tasks.NavegarPerfil;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class ActualizarContratistaStepDefinitions {

    @Cuando("^Cuando el usuario oprima el campo a actualizar e ingrese su numero numero telefonico$")
    public void cuandoElUsuarioOprimaElCampoAActualizarEIngreseSuNumeroNumeroTelefonico(List<DatosActualizar>datosActualizar) {
       theActorInTheSpotlight().attemptsTo(ActualizarContratista.actualizar(datosActualizar));
    }


    @Entonces("^visualizara una ventana emergente que dira que los datos fueron actualizados$")
    public void visualizaraUnaVentanaEmergenteQueDiraQueLosDatosFueronActualizados() {

    }

}
